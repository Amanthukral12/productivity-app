import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";
import image from "../../assets/productivity.webp";
const Login = () => {
  return (
    <div className=" lg:bg-black  h-[100vh] lg:flex lg:justify-center lg:items-center">
      <div className="w-full h-full z-10 lg:w-4/5 lg:h-4/5 flex flex-col-reverse lg:flex-row">
        <section className="bg-white h-[70%] w-full lg:w-1/2 lg:h-full flex flex-col items-center lg:rounded-l-3xl">
          <h1 className="hidden lg:block lg:text-4xl lg:font-bold lg:mt-16 ">
            Produkto
          </h1>
          <h3 className="text-xl lg:text-xl font-semibold mt-10">Welcome</h3>
          <p className="text-lg lg:text-xl font-medium mt-10 mb-10">
            Your all-in-one productivity companion
          </p>
          <div>
            <button
              className="w-full max-w-sm border-2 border-gray-300 focus:border-gray-300 px-10 py-2 rounded-lg font-medium text-xl mt-10 flex items-center gap-2 hover:bg-slate-50"
              onClick={() => {}}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="flex w-1/2 mx-auto justify-center items-center absolute bottom-10 lg:bottom-32 lg:mt-10">
            <FaGlobe className="h-12 w-12 px-2 fill-slate-700" />
            <FaGithub className="h-12 w-12 px-2 fill-slate-700" />
            <FaLinkedin className="h-12 w-12 px-2 fill-slate-700" />
            <FaTwitter className="h-12 w-12 px-2 fill-slate-700" />
          </div>
          <span className="absolute bottom-5 lg:bottom-24">
            © Copyright 2025, Aman Thukral.
          </span>
        </section>
        <section className="bg-[#3a4d8f] w-full h-[40%] lg:h-full flex flex-col justify-center items-center lg:w-1/2 lg:rounded-r-3xl">
          <img
            src={image}
            className="h-[150px] w-[200px] lg:h-[250px] lg:w-[300px]"
            alt="parksaver image"
          />
          <h1 className="text-5xl text-slate-300 font-bold">Produkto</h1>
        </section>
      </div>
    </div>
  );
};

export default Login;
