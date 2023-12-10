import container from "@/di/container";
import {Api} from "@/api/Api";
import {NextRequest} from "next/server";

const api = container.get<Api>('Api');
export async function POST(request: NextRequest) {
    return await api.login(request)
}