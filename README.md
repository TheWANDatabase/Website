# The WAN DB

A project aiming to index every episode, topic, and cast member of the popular technology podcast ["The WAN Show"](https://www.imdb.com/title/tt11481658/)

## Goals

- [ ] 100% coverage of episodes.
- [ ] 100% coverage of topics.
- [ ] 100% coverage of cast members.
- [ ] 100% coverage of merch messages.
- [ ] Community driven data.
- [ ] Beautiful user interface to tie it all together

## Screenshots

> Coming soon

## Contributing

> coming soon

## Self Hosting

Due to the nature of the tech stack involved, and the sensetive variables and tokens needed to make this service run smoothly, there is not, nor will there ever be a self-hosted version that is officially endorsed by us.

## Tech Stack

This project is backed by Firebase, hosted by Cloudflare Pages, queries Cloudflare Workers, relies on Docker containers to do hundreds of background menial tasks. Content is stored on Cloudflare R2, Cloudflare Stream, and Cloudflare Images. Import tasks are queued up using a mixture of RabbitMQ, and Cloudflare Queues depending on the processing power required to run the task. All images from third party websites are hosted on Cloudflare Images to protect the user's privacy.

This stack, whilst complicated, is just enough to make this complex heart work smoothly, on time, every week. This stack will be expanded upon in a dedicated document, explaining what each module that makes the project work does, but that will be in another repository (link will be added when it is ready)
