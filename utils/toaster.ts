import { toast } from 'react-toastify'

const useToaster = (type: string, message: string) => {
  switch (type) {
    case 'error':
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      break

    default:
      break
  }
}

export default useToaster
