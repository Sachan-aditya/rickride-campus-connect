
import Navbar from "@/components/layout/navbar";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#F6F8FA] pb-20">
      <Navbar />
      <main className="container mx-auto max-w-2xl pt-24 px-4">
        <div className="bg-white shadow-md rounded-xl p-8">
          <h1 className="text-3xl font-bold mb-3 text-blue-700">About Us</h1>
          <p className="text-gray-700 mb-2">
            <b>RickRide</b> is a campus rickshaw sharing platform built to make student and staff commutes seamless, safe, and greener.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is to connect riders and drivers in real-time across campus so you can always find a ride when you need one.
          </p>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Easy ride requests from anywhere on campus.</li>
            <li>Verified drivers with safe rides and tracking.</li>
            <li>Saving time, money, and reducing carbon emissions.</li>
            <li>Built by students, for the campus community.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
