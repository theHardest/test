import { createRouter, createWebHistory } from "vue-router";
import authCheck from "../authCheck";

const routes = [
    {
        path: "/",
        redirect: "/user",
        children: [
            {
                name: "User",
                path: "user",
                component: () => import("../pages/User.vue"),
            },
            {
                name: "Beer",
                path: "beer",
                component: () => import("../pages/Beer.vue"),
            },
        ],
    }
];

const router = createRouter({ routes, history: createWebHistory() });
router.beforeEach(async (to, from, next) => {
    console.log(from);
    
    const auth = await authCheck();
    to.name === "User" || auth ? next() : next({ name: "User" });
});

export default router;