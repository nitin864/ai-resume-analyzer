import { title } from "process"
import { usePuterStore } from "~/lib/puter"

export const meta = () =>([
    {title: 'Resumind | Auth'},
    {name:"description", content:"Log in into your Account"},

])

const auth = () => {
    const {isLoading} = usePuterStore();
  return (
     <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-center min-h-screen flex items-center justify-center">
         <div className="gradient-border shadow-lg">
            <section className="flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center gap-2 text-center">
                   <h1>Welcome</h1>
                   <h2>Welcome back! Let’s get you closer to your next opportunity.</h2>
                </div>
            </section>
         </div>
    </main>

  )
}

export default auth