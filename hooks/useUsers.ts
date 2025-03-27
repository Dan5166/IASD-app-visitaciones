import { getFromLocalStorage } from "@/actions/get-from-localstorage"
import { setInLocalStorage } from "@/actions/set-in-localstorage"
import { User } from "@/interfaces/user.iterface"
import { auth, getDocument } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DocumentData } from "firebase/firestore"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// TODO: Usar un hook que guarde los datos del usuario en Zustand, y que asi sean accesibles desde cualquier lado

export const useUsers = () => {
    const [user, setUser] = useState<User| undefined | DocumentData>(undefined)
    const pathName = usePathname();
    const router = useRouter();

    const protectedRoutes = ['/visitador'];
    const isInProtectedRoute = protectedRoutes.includes(pathName);

    const getUserFromDB = async (uid: string) => {
        const path = `users/${uid}`

        try {
            let res = await getDocument(path);
            setUser(res);
            setInLocalStorage("user", res)
        } catch (error: any) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        return onAuthStateChanged(auth, async (authUser) => {
            if (authUser) { // Existe usuario autenticado
                const userInLocal = getFromLocalStorage('user')
                if (userInLocal) {
                    setUser(userInLocal);
                } else {
                    getUserFromDB(authUser.uid)
                }
            } else { // No existe usuario autenticado
                if(isInProtectedRoute) { // Esta en una ruta protegida
                    router.push('/auth'); // Se manda a la pagina de pedir horas
                }
            }
        })
    }, [])

    return user;
    
}