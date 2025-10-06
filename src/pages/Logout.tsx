import { useEffect } from "react";

const Logout = () => {
    useEffect(() => {
        try {
            // Clear local/session storage
            try { localStorage.clear(); } catch { }
            try { sessionStorage.clear(); } catch { }

            // Expire all cookies
            const cookies = document.cookie.split(";");
            const expire = "Expires=Thu, 01 Jan 1970 00:00:00 GMT";
            const path = "Path=/";
            const hostname = window.location.hostname;
            const domains = [
                "",
                `Domain=${hostname}`,
                hostname.startsWith(".") ? "" : `Domain=.${hostname}`,
            ].filter(Boolean);

            cookies.forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                // Try multiple domain variants
                domains.forEach((domain) => {
                    document.cookie = `${name}=; ${expire}; ${path}${domain ? "; " + domain : ""}`;
                });
            });
        } finally {
            // Redirect to signin
            window.location.replace("/signin");
        }
    }, []);

    return null;
};

export default Logout;


