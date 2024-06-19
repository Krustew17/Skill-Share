import Cookies from "js-cookie";

export default async function tryRefreshToken(responseJson) {
    if (
        responseJson.statusCode === 400 &&
        responseJson.message === "Invalid or expired token"
    ) {
        const refreshToken = Cookies.get("refreshToken");

        const refreshResponse = await fetch(
            import.meta.env.VITE_VITE_API_URL + "/auth/refresh-token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
            }
        );
        const refreshResponseJson = await refreshResponse.json();

        if (refreshResponseJson.access_token) {
            localStorage.setItem("token", refreshResponseJson.access_token);
            const userResponse = await fetch(
                import.meta.env.VITE_API_URL + "/users/me",
                {
                    headers: {
                        Authorization: `Bearer ${refreshResponseJson.access_token}`,
                    },
                    credentials: "include",
                }
            );
            console.log("refreshed");
            const user = await userResponse.json();
            Cookies.set("loggedUserId", user.user.id, {
                secure: true,
                sameSite: "none",
            });
        } else {
            logout();
            console.error("Token refresh failed");
            return;
        }
    }
}
