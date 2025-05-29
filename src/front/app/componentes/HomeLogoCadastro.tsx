export default function HomeLogoCadastro() {
    return (
        <div
            className="w-1/4 h-screen text-white flex justify-center items-end"
            style={{
                background: "linear-gradient(to top, var(--corprincipal), var(--corsecundaria))"
            }}
        >
            <a href="/">
                <div className="flex flex-col text-left p-12 my-35">
                    <h1 className="text-5xl font-bold mb-2">Psi+</h1>
                    <p className="text-lg max-w-md ">
                        Conectando emoções, organizando cuidados.
                    </p>
                </div>
            </a>
        </div>
    );
}