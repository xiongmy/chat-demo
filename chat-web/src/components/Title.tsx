export default function Profile({ text = '' }) {
  return (
    <div className="w-full h-8 leading-8 pl-2 border-b-1 border-gray-300 text-base bg-gray-100">
      {text}
    </div>
  );
}