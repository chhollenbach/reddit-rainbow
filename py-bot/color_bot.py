import praw
import requests
import json
import config


def main():
    # init bot
    reddit = praw.Reddit(
        "rainbow-bot",
        user_agent='windows-python-script:reddit-rainbow-bot:v0.1 (by u/r-portfolio-Bot>)'
    )

    # create color list - to expand later
    color_list = ['red', 'yellow', 'blue', 'orange', 'green', 'violet', 'purple']

    # set header for POST request
    headers = {'content-type': 'application/json'}

    # create a stream of reddit comments
    subreddits = reddit.subreddit("all")
    for comment in subreddits.stream.comments():
        comment_color_info = process_comment(comment, color_list)
        for color_data in comment_color_info:
            json_payload = json.dumps(color_data)
            response = requests.post('http://localhost:3000/pybot_data',
                                     data = json_payload,
                                     headers = headers,
                                     auth = (config.username, config.password))


def process_comment(comment, colors):
    """
    Helper function that scans a text comment for any mention of a color. Returns a list containing
    lists if info i
    """
    color_info = []
    for color in colors:
        if ' ' + color + ' ' in comment.body.lower():
            if color == 'purple':
                color_info.append({'comment_id': comment.id,
                                   'created_utc': comment.created_utc,
                                   'color': 'violet',
                                   'subreddit_display_name': comment.subreddit.display_name})
            else:
                color_info.append({'comment_id': comment.id,
                                   'created_utc': comment.created_utc,
                                   'color': color,
                                   'subreddit_display_name': comment.subreddit.display_name})

    return color_info

if __name__ == "__main__":
    main()