import { auth } from "@/auth";
import { prisma } from "@/server/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import ProfileForm from "./profile-form";

// export type FocusSession = {
//   id: string;
//   description: string;
//   typeActivity: string;
//   duration: number;
//   startTime: string | Date;
//   endTime: string | Date;
//   createdAt: string | Date;
// }

export default async function Profile() {

    const session = await auth()

    if (!session?.user?.email) {
        return redirect('/signin')
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        }
    })

    if (!user) {
        return redirect('/signin')
    }
    return (
        <section className="
        h-dvh flex flex-col items-center
        p-8
        ">
            <ProfileForm user={user}/>
        </section>
    )
}