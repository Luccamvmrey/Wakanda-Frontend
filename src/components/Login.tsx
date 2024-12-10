import {ChangeEvent, FormEvent, useState} from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import useApi from "@/hooks/useApi.ts";

function Login() {
    const {user, getUser, createUser, resetUser} = useApi();

    const [cardState, setCardState] = useState<"login" | "register">("login");
    const [cpf, setCpf] = useState("");
    const [name, setName] = useState("");

    function handleCpfChange(event: ChangeEvent<HTMLInputElement>) {
        setCpf(event.target.value.replace(/\D/g, ""));
    }

    function formatCpf(cpf: string) {
        return cpf
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    }

    function toggleIsLogin() {
        resetUser();
        setCardState(prevState => {
            return prevState === "login" ? "register" : "login";
        });
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (cardState === "login") {
            await getUser(cpf);
        } else {
            await createUser({name, cpf});
        }
    }

    const cardMapping = {
        login: {
            title: "Entre em sua conta",
            hasName: false,
            toggleButton: "Registre-se",
            action: "Entrar",
        },
        register: {
            title: "Registre-se",
            hasName: true,
            toggleButton: "Entre em sua conta",
            action: "Registrar",
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{cardMapping[cardState].title}</CardTitle>
            </CardHeader>
            <CardContent>
                {!user && (
                    <form onSubmit={handleSubmit} id="cpf-form">
                        {cardMapping[cardState].hasName && (
                            <div>
                                <Label htmlFor="name">Nome</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Insira seu nome"
                                    className="w-[275px]"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>
                        )}
                        <Label htmlFor="cpf">CPF</Label>
                        <Input
                            type="text"
                            name="cpf"
                            placeholder="Insira seu CPF"
                            className="w-[275px]"
                            maxLength={14}
                            value={formatCpf(cpf)}
                            onChange={handleCpfChange}
                        />
                    </form>
                )}
                {user && (
                    <div className="flex w-full justify-center">
                        <p className="text-xl">Olá, {user.name}!</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={toggleIsLogin}
                >
                    {cardMapping[cardState].toggleButton}
                </Button>
                <Button type="submit" form="cpf-form">
                    {cardMapping[cardState].action}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default Login;