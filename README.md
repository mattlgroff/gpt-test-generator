# GPT Test Generator

Created by Matt Groff

GPT Test Generator is a simple web app that generates test cases for your code using OpenAI's GPT-4 API. The app supports Jest React Test Renderer, Cypress Component Test, and Jest Node test types.

## Prerequisites

Before you begin, you will need an OpenAI API key. Sign up for one at https://beta.openai.com/signup/ if you don't already have one.

## Setup

1. Clone this repository:

```bash
git clone https://github.com/mattlgroff/gpt-test-generator.git
cd gpt-test-generator
```

2. Create a `.env` file in the project root directory with your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key
```

You can refer to the `.example.env` file for an example.

## Running the app

### Using Bun

1. Install Bun by following the instructions at [https://bun.sh/](https://bun.sh/)

2. Install the dependencies:
```bash
bun install
```

3. Start the app:
```bash
bun start
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Using Docker

1. Build the Docker image:
```bash
docker build -t gpt-test-generator .
```

2. Run the Docker container:
```bash
docker run -it -p 3000:3000 --env-file .env gpt-test-generator
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Running tests
```bash
bun test
```