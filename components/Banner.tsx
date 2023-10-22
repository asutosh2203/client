const Banner: React.FC<{ heading: string; subHeading?: string }> = ({
    heading,
    subHeading,
  }) => {
    return (
      <div className="flex justify-between items-center bg-yellow-400 border-y border-black p-10 select-none">
        <div className="space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">{heading}</h1>
          {subHeading && <h2>{subHeading}</h2>}
        </div>
        <img
          src="https://cdn.worldvectorlogo.com/logos/medium-1.svg"
          alt="logo"
          className="hidden md:inline-flex h-32 lg:h-full max-w-[300px]"
        />
      </div>
    )
  }
  
  export default Banner
  