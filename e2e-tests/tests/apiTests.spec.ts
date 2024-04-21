import { test, expect, defineConfig } from '@playwright/test';
import { z } from 'zod';

const BASE_URL = "https://web.genvidea.com/api"
// make sure to replace this token as it will expire
const ACCESS_TOKEN = "eyJhbxxxxxxxxxxxxx"
const headers = {
    "Cookie": `access_token=${ACCESS_TOKEN}`,
    "Content-Type": "application/json"
}

test.describe("API Testing", () => {
    test('should not be able to get user settings without auth token', async ({ request }) => {
        const userSettings = await request.get(`${BASE_URL}/profile/user-settings`, {
            // leaving out the headers
        })
        expect(userSettings.status()).toBe(401);
    })

    test('should be able to get user settings', async ({ request }) => {
        const userSettings = await request.get(`${BASE_URL}/profile/user-settings`, { headers })
        expect(userSettings.ok()).toBeTruthy();
        expect(userSettings.status()).toBe(200);
        const response = await userSettings.json()
        const UserSettings = z.object({
            username: z.string(),
            bio: z.string(),
            profile_picture: z.string()
        })
        expect(() => UserSettings.parse(response)).not.toThrow()
    });

    test('should be able to update get user settings', async ({ request }) => {
        const username = "username_abcd"
        const bio = "Hey There! I am using genvidea"
        const userSettings = await request.post(`${BASE_URL}/profile/user-settings`, {
            headers,
            data: { username, bio }
        })
        expect(userSettings.ok()).toBeTruthy();
        expect(userSettings.status()).toBe(200);
        const response = await userSettings.json()

        // check that the response has updated values for bio and username along with the correct shape
        const UserSettings = z.object({
            username: z.literal(username),
            bio: z.literal(bio),
            profile_picture: z.string()
        })
        expect(() => UserSettings.parse(response)).not.toThrow()
    });

    test('should be able to update visibility of a file', async ({ request }) => {
        const file_id = "24d1a07f-ad9a-4869-812d-6a5dd87caee6"
        await request.post(`${BASE_URL}/files/visibility`, {
            headers,
            data: {
                file_id,
                is_public: true,
            }
        })
        const response = await request.get(`${BASE_URL}/files/get-file/${file_id}`, { headers }).then(r => r.json())
        expect(response.is_public).toBeTruthy()
    });
})

export default defineConfig({
    use: {
        baseURL: 'https://web.genvidea.com/api',
        extraHTTPHeaders: {
            "Cookie": `access_token=${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    }
});