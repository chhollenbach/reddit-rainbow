import praw
import requests
import json
import os
import random
import datetime


def main():
    # set random seed
    random.seed(12368)

    # set window for batching requests
    timeA = datetime.datetime.now().replace(hour=0, minute=0, second=0, microsecond=0).time()
    timeB = datetime.datetime.now().replace(hour=0, minute=30, second=0, microsecond=0).time()

    # set up queue to store comments in for batching later
    color_data_queue = []

    # init bot
    reddit = praw.Reddit(
            client_id=os.environ.get('client_id'),
            client_secret=os.environ.get('client_secret'),
            user_agent=os.environ.get('user_agent')
            )

    # create color list - to expand later
    color_list = ['red', 'yellow', 'blue', 'orange', 'green', 'violet', 'purple', 'indigo']

    # set header for POST request
    headers = {'content-type': 'application/json'}

    # create a stream of reddit comments
    subreddits = reddit.subreddit("all")
    for comment in subreddits.stream.comments():
        comment_color_info = process_comment(comment, color_list)
        rand_int = random.randint(0,99)
        # limit comment data sent due to Heroku table limits
        storage_percent = int(os.environ.get('storage_percent')) - 1
        if rand_int <= storage_percent:
            for color_data in comment_color_info:
                color_data_queue.append(color_data)
        # limit batching to three times a day to conserve dyno hours in Heroku
        if (timeA <= datetime.datetime.now().time() and datetime.datetime.now().time() < timeB) or (timeA.replace(hour=8) <= datetime.datetime.now().time() and datetime.datetime.now().time() < timeB.replace(hour=8)) or (timeA.replace(hour=16) <= datetime.datetime.now().time() and datetime.datetime.now().time() < timeB.replace(hour=16)) or not (1 == int(os.environ.get('enforced_downtime'))):
            while color_data_queue:
                queue_front = color_data_queue.pop(0)
                json_payload = json.dumps(queue_front)
                response = requests.post('https://reddit-rainbow-web-api.herokuapp.com/pybot_data',
                                        data = json_payload,
                                        headers = headers,
                                        auth = (os.environ.get('username'), os.environ.get('password')))


def process_comment(comment, colors):
    """
    Helper function that scans a text comment for any mention of a color. Returns a list containing
    lists, where each sublist contains comment metadata if a color was in the comment. If no color was in the comment, empty list is returned
    """
    color_info = []
    for color in colors:
        if ' ' + color + ' ' in comment.body.lower():
            if color == 'purple':
                color_info.append({'comment_id': comment.id,
                                   'created_utc': comment.created_utc,
                                   'color': 'violet',
                                   'subreddit_display_name': comment.subreddit.display_name,
                                   'body': comment.body,
                                   'score': comment.score})
            else:
                color_info.append({'comment_id': comment.id,
                                   'created_utc': comment.created_utc,
                                   'color': color,
                                   'subreddit_display_name': comment.subreddit.display_name,
                                   'body': comment.body,
                                   'score': comment.score})

    return color_info

if __name__ == "__main__":
    main()