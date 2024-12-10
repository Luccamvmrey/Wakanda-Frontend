import {useState} from "react";

const baseUrl = "https://wakanda-backend.vercel.app";

type User = {
    name: string;
    cpf: string;
}

export default function useApi() {
    const [user, setUser] = useState<User | null>();

    async function getUser(cpf: string) {
        const response = await fetch(`${baseUrl}/${cpf}`);
        console.log(response);
        const user = await response.json();
        console.log(user);

        setUser(user as User);
    }

    async function createUser(user: User) {
        const response = await fetch(baseUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        return await response.json()
    }

    function resetUser() {
        setUser(null);
    }

    return {
        user,
        getUser,
        createUser,
        resetUser
    }
}