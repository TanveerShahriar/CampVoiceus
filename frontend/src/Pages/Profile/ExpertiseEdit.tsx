import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2, Upload, X } from 'lucide-react'

interface Expertise {
  name: string
  credentialUrl?: string
}

export default function ExpertiseEdit() {
  const [expertiseList, setExpertiseList] = useState<Expertise[]>([])
  const [currentExpertise, setCurrentExpertise] = useState<Expertise>({ name: "", credentialUrl: "" })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserExpertise = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("User is not authenticated")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/token`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { expertise } = response.data
        setExpertiseList(expertise || [])
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user expertise")
      } finally {
        setLoading(false)
      }
    }

    fetchUserExpertise()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setCurrentExpertise((prev) => ({ ...prev, name: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) {
      setError("User is not authenticated")
      return
    }

    if (!currentExpertise.name) {
      setError("Expertise name is required.")
      return
    }

    if (expertiseList.length >= 3) {
      setError("You can only have up to 3 areas of expertise. Please delete one to add another.")
      return
    }

    const formPayload = new FormData()
    formPayload.append("name", currentExpertise.name)
    if (file) {
      formPayload.append("expertCredentialsUrl", file)
    }

    try {
      setLoading(true)
      setError(null)
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/users/profile/expertise/edit`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      setExpertiseList(response.data.expertise)
      setCurrentExpertise({ name: "", credentialUrl: "" })
      setFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err: any) {
      console.error("Error updating expertise:", err)
      setError(err.response?.data?.message || "Failed to update expertise. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpertise = async (name: string) => {
    const token = localStorage.getItem("token")

    if (!token) {
      setError("User is not authenticated")
      return
    }

    try {
      setLoading(true)
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/users/profile/expertise/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { name },
        }
      )
      setExpertiseList(response.data.expertise)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err: any) {
      console.error("Error deleting expertise:", err)
      setError(err.response?.data?.message || "Failed to delete expertise. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Expertise</h1>
          {success && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
              <p className="font-bold">Success</p>
              <p>Operation completed successfully!</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleAddOrUpdate} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                Expertise
              </label>
              <input
                id="expertise"
                type="text"
                value={currentExpertise?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter expertise"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expertCredentialsUrl" className="block text-sm font-medium text-gray-700">
                Upload Credential
              </label>
              <div className="mt-1 flex items-center">
                <label
                  htmlFor="expertCredentialsUrl"
                  className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Upload className="h-4 w-4 mr-2 inline-block" />
                  Choose File
                </label>
                <input
                  type="file"
                  id="expertCredentialsUrl"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {file && (
                  <span className="ml-3 text-sm text-gray-600">
                    {file.name}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add/Update Expertise
            </button>
          </form>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Expertise</h2>
            <div className="space-y-4">
              {expertiseList.map((exp) => (
                <div
                  key={exp.name}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg transition duration-150 ease-in-out hover:bg-gray-200"
                >
                  <span className="font-medium text-gray-800">{exp.name}</span>
                  <button
                    onClick={() => handleDeleteExpertise(exp.name)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Delete expertise</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

