const Input = (props: any) => {
  return (
    <div>
      <input
        {...props}
        type="text"
        className="py-2 px-4 border border-solid rounded border-gray-400"
      />
    </div>
  );
};

export default function Subscribe() {
  const subscribe = () => {};
  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl mb-4 font-semibold">Subscribe form</h3>
      <div>
        <form action="/subscribe">
          <div className="mb-4">
            <label htmlFor="movieTitle">Movie title</label>
            <Input type="text" placeholder="movie title" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input ype="text" placeholder="it's safe with us" />
          </div>
          <div className="mt-4">
            <button className="py-4 border-none rounded-md px-4 bg-green-500 text-white text-xl">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
