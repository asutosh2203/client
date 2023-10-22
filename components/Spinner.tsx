import Loader from 'react-loader-spinner'

const Spinner: React.FC<{
  message?: string
  type?:
    | 'Bars'
    | 'Audio'
    | 'BallTriangle'
    | 'Circles'
    | 'Grid'
    | 'Hearts'
    | 'Oval'
    | 'Puff'
    | 'Rings'
    | 'TailSpin'
    | 'ThreeDots'
    | 'Watch'
    | 'RevolvingDot'
    | 'Triangle'
    | 'Plane'
    | 'MutatingDots'
    | 'CradleLoader'
}> = ({ type, message }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Loader
        type={type || 'Bars'}
        color="#00bfff"
        secondaryColor="#000000"
        height={50}
        width={200}
      />
      <p className="text-lg font-semibold text-center px-2">{message ? message : ''}</p>
    </div>
  )
}

export default Spinner
