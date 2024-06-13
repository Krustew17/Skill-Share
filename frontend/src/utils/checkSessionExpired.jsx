export const isCookieExpired = (cookieName) => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`));
    if (!cookieValue) return true; // If the cookie is not found, it's considered expired
    const expiration = new Date(decodeURIComponent(cookieValue.split("=")[1]));
    return expiration < new Date(); // Check if the expiration date is in the past
};
