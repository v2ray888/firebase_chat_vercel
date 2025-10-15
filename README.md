# Next.js Firebase Chat Application

This is a web-based chat application built with Next.js and Firebase.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/v2ray888/firbase_chat.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `.next` folder.
*   `npm run start`: Starts a Next.js production server.
*   `npm run lint`: Runs the linter.
*   `npm run typecheck`: Runs the TypeScript type checker.
*   `npm run db:setup`: Sets up the database schema.
*   `npm run db:seed`: Seeds the database with initial data.

## Building for Production

To build the application for production, run the following command:

```bash
npm run build
```

This will create a `.next` folder with the production-ready build of your application.

## Deployment

This application is ready to be deployed to a variety of platforms that support Node.js applications.

## Using the Chat Widget

To integrate the chat widget into your website, add the following code snippet to your HTML file just before the closing `</body>` tag:

```html
<div id="neonsupport-widget-container"></div>
<script 
  src="YOUR_DEPLOYED_URL/widget.js" 
  data-widget-id="57f13bb3-7819-45db-9961-bce85b83f3d2" 
  data-base-url="YOUR_DEPLOYED_URL"
  defer>
</script>
```

Replace `YOUR_DEPLOYED_URL` with the actual URL where your application is deployed (e.g., your Vercel URL).

For example, if your Vercel deployment URL is `https://your-app.vercel.app`, the code would be:

```html
<div id="neonsupport-widget-container"></div>
<script 
  src="https://your-app.vercel.app/widget.js" 
  data-widget-id="57f13bb3-7819-45db-9961-bce85b83f3d2" 
  data-base-url="https://your-app.vercel.app"
  defer>
</script>
```

The `data-base-url` attribute is important for ensuring the widget works correctly in production environments.