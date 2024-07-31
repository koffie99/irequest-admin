"use client"
import Image from "next/image"
import { useState } from "react"
import { Toaster, toast } from "react-hot-toast"

export default function Home() {
  const [staffId, setStaffId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    try {
      setLoading(true)
      const myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      const raw = JSON.stringify({
        staff_id: staffId ? staffId.toLowerCase() : "",
        password: password,
      })

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      }

      fetch(
        "https://irequest.rumlyn.com/api/v1/registrars/login",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result.msg === "login successful") {
            setLoading(false)
            toast.success("Login Successful")
            location.href = '/portal'
            console.log(result)
          } else {
            setLoading(false)
            toast.error(result.msg)
          }
        })
        .catch((error) => console.error(error))
    } catch (err) {
      setLoading(false)
      console.error(err)
      alert("An error occurred while trying to log in")
    }
  }

  return (
    <main className="flex min-h-[100vh] items-center justify-center w-full">
      <div className="flex-[0.5] bg-white h-[100vh] flex items-center justify-center flex-col">
        <Image width={100} height={100} alt="logo" src="/images/ilogo.png" />
        <h1 className="text-[2rem] font-bold text-[#320F6B]">iRequest Admin</h1>
        <div className="flex flex-col gap-4 mt-12 md:w-[50%] w-[80%]">
          <input
            type="text"
            placeholder="Email"
            className="ring-1 ring-[#ccc] p-3 rounded outline-[#320F6B]"
            onChange={(e) => setStaffId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="ring-1 ring-[#ccc] p-3 rounded outline-[#320F6B]"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-[#320F6B] p-3 text-white rounded mt-4"
            onClick={() => handleLogin()}
          >
            {loading ? "Logging in... " : "Login"}
          </button>
        </div>
      </div>
      <div className="flex-[0.5] front-cover h-[100vh]"></div>

      <Toaster />
    </main>
  )
}
