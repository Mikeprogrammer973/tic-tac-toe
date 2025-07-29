import { controllers } from "../controllers/index.js";
import { globals } from "./globals.js";

export async function handle_controller(route)
{
    await new controllers.Auth().check()
    globals.chat.toggle(false)
    controllers[route]()
}