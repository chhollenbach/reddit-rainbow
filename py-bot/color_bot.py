import praw


def main():
    # init bot
    reddit = praw.Reddit(
        "rainbow-bot",
        user_agent='windows-python-script:reddit-rainbow-bot:v0.1 (by u/r-portfolio-Bot>)'
    )

    # create color list - to expand later
    color_list = ['red', 'yellow', 'blue', 'orange', 'green', 'violet', 'purple']

    # create a stream of reddit comments
    subreddits = reddit.subreddit("all")
    for comment in subreddits.stream.comments():
        process_comment(comment, color_list)


def process_comment(comment, colors):
    """
    Helper function that scans a text comment for any mention of a color, and returns data if found
    """
    color_info = []
    for color in colors:
        if ' ' + color + ' ' in comment.body.lower():
            if color == 'purple':
                color_info.append([comment.created_utc, 'violet', comment.subreddit_id])
                print("violet")
            else:
                color_info.append([comment.created_utc, color, comment.subreddit_id])
                print(color)

if __name__ == "__main__":
    main()