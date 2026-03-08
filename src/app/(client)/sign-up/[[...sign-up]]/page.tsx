import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white absolute top-0 left-0 z-50">
      <div className="hidden md:block align-middle my-auto">
        <SignUp forceRedirectUrl="/dashboard" />
      </div>
      <div className="block md:hidden px-3 h-[60%] my-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800">欢迎使用 ZhuoIN<span className="text-indigo-600">AI面试</span></h1>
        <h1 className="text-md my-3 text-center text-gray-800">移动端版本目前正在建设中🚧</h1>
        <p className="text-center text-gray-600 mt-3">为获得最佳体验，请使用电脑端注册或登录。给您带来不便，敬请谅解</p>
      </div>
    </div>
  );
}
export default SignUpPage;
