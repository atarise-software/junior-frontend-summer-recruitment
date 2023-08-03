

![](./src/assets/logo.png)

# JFE - Summer recruitment

## Description

1. An API about dogs is provided: `https://dog.ceo/api/breeds/image/random`
2. Our application should fetch the dog image right away and then fetch another one every 3 seconds.
3. After fetching & displaying 6 images (we want 2 rows of 3 images each in GRID), we should:
   - substitute the images from the beginning - that is, the image downloaded as 7 is to be in place of 1, and so on.
   - after downloading 9 images, we want to stop downloading images, therefore only images in 1 row will be substituted.

## Getting Started

1. Create `.env.local` file and add environment variables. (see: [Environment variables](#environment-variables)). You can simply copy `.env.example`:

    ```bash
    cp .env.example .env.local
    ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

## Testing

Test are based on Vitest & RTL. To run tests:

```bash  
npm run test
```

## Environment variables

| ENV Name                  | ENV Default value | Description                                                                                                                                                                                                                                                                                            |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL`             | `https://dog.ceo/api` | Specifies the base API path from which resources would be fetched.                                                        |
