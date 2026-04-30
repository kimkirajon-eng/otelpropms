import redis
import os
import json

class MessageBus:
    def __init__(self):
        self.r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

    def publish(self, channel, data):
        self.r.publish(channel, json.dumps(data))

    def subscribe(self, channel):
        pubsub = self.r.pubsub()
        pubsub.subscribe(channel)
        return pubsub
