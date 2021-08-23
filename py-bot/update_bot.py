import requests
import os
import aiohttp
import asyncio
import asyncpraw
import praw
import asyncprawcore


async def main():
    """
    A utility script that updates the color database with more current comment scores, deletes comments
    that users/mods have deleted to maintain privacy, and prevents db from being overfilled.
    """
    # init bot
    reddit_instance = asyncpraw.Reddit(
        user_agent =os.environ.get('user_agent'),
        client_id=os.environ.get("client_id"),
        client_secret=os.environ.get("client_secret")
    )


    # get all comments
    async with aiohttp.ClientSession(auth=aiohttp.BasicAuth(os.environ.get('username'), os.environ.get('password'))) as session:
        comment_queue = await get_all_comments()
        tasks = []
        n = 0
        for comment_object in comment_queue:
            n += 1
            tasks.append(asyncio.create_task(update_db(session, comment_object,reddit_instance, n)))
        # iterate through comments while total < threshold. Update scores, delete comments if they are deleted
        # also deletes oldest rows rows beyond purge percentage
        await asyncio.gather(*tasks)
        await session.close()
        print("DB Update Complete")


async def get_all_comments():
    """
    Retrieves all rows from reddit_rainbow_raw, returns array of results, which each element being the row object
    """
    response = requests.get('https://reddit-rainbow-web-api.herokuapp.com/all_rows/')
    json_data = response.json()
    return json_data

async def update_db(session, comment_object, reddit_instance, n):
    """
    Given a comment object, updates the score if the current score of the comment is different. Comment is deleted
    if current comment is deleted or removed, for privacy reasons. All comments over purge percentage are deleted
    too due to limited Heroku PostgreSQL storage.
    """
    comment_id = comment_object["comment_id"]
    id = comment_object["id"]
    db_max = float(os.environ.get('db_max'))
    purge_percent = float(os.environ.get('purge_percentage'))
    purge_threshold = purge_percent * db_max

    if n >= purge_threshold:
            delete_url = 'https://reddit-rainbow-web-api.herokuapp.com/comment_by_id/' + comment_id + "/" + str(id)
            async with session.delete(delete_url) as response:
                return
    else:
        try:
            current_comment = await reddit_instance.comment(id=comment_id)
        except (asyncpraw.exceptions.ClientException, asyncprawcore.exceptions.RequestException, RuntimeError, AttributeError):
            return
        if current_comment.body == "[deleted]" or current_comment.body == "[removed]":
            delete_url = 'https://reddit-rainbow-web-api.herokuapp.com/comment_by_id/' + comment_id + "/" + str(id)
            async with session.delete(delete_url) as response:
                return
        elif current_comment.score != comment_object["score"]:
            new_score = current_comment.score
            put_url = 'https://reddit-rainbow-web-api.herokuapp.com/new_score/' + str(new_score) + '/at/' + comment_id + "/" + str(id)
            async with session.put(put_url) as response:
                return


if __name__ == "__main__":
    asyncio.run(main())