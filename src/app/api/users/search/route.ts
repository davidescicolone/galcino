import container from "@/di/container";
import {Api} from "@/api/Api";
import {NextRequest} from "next/server";

const api = container.get<Api>('Api');
export async function GET(request: NextRequest) {
    return await api.searchUser(request)
}