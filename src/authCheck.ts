import { useUserStore } from "./stores";
import axios from "axios";

export default async () => {
    const { token } = useUserStore();
    const { data: auth } = await axios.get("http://localhost:8888/user/auth", {
        headers: { Authorization: `Bearer ${token}` }
    }).catch(error => error);
    return auth;
}