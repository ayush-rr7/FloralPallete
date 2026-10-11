import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Navigation,
} from "lucide-react";

// --------------------------------------------------
// Shop Details
// Replace the dummy values with the actual details.
// --------------------------------------------------

const shopDetails = {
  name: "Anil Flower House and Car Decoration",

  address: "Near Civil Hospital, Ropar Road Kurali ",
  city: "Mohali",
  pincode: "140103.",

  phone1: "+91 98726 40636",
  phone2: "+91 93562 15236",
  email: "rk58780721@gmail.com",
  whatsapp: "+91 98726 40636",
  hours: "6:30 AM - 9:00 PM",

  mapsUrl: "https://maps.app.goo.gl/1uPYQtdoz9rPY7XG7",
};

function Contact() {
  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to enquire about your flowers and services.",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-pink-50 px-6 py-14 text-center">
        <p className="text-sm font-medium text-pink-600 uppercase tracking-wide">
          Get in Touch
        </p>

        <h1 className="mt-2 text-4xl md:text-5xl font-semibold text-gray-900">
          Contact Us
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-gray-600 leading-7">
          Have a question about our flowers, bouquets, car decoration, delivery,
          or custom arrangements? We'd love to hear from you.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shop Information */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Visit Our Store
              </h2>

              <p className="mt-2 text-gray-600 text-sm leading-6">
                Visit us for fresh flowers, beautiful bouquets and floral
                decoration services.
              </p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">Shop Address</h3>

                  <p className="mt-1 text-sm text-gray-600 leading-6">
                    {shopDetails.name}
                    <br />
                    {shopDetails.address}
                    <br />
                    {shopDetails.city} - {shopDetails.pincode}
                  </p>

                  <a
                    href={shopDetails.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-pink-600 hover:text-pink-700"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Business Hours
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">Monday - Sunday</p>

                  <p className="text-sm text-gray-600">{shopDetails.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-pink-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Get in Touch
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Choose your preferred way to contact us.
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {/* Call */}
                <a
                  href={`tel:${shopDetails.phone}`}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-5 text-center hover:border-pink-300 hover:bg-pink-50 transition"
                >
                  <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-pink-600" />
                  </div>

                  <span className="font-medium text-gray-900">Call Us</span>

                  <span className="text-xs text-gray-500">
                    {shopDetails.phone}
                  </span>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${shopDetails.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-5 text-center hover:border-green-300 hover:bg-green-50 transition"
                >
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <span className="font-medium text-gray-900">WhatsApp</span>

                  <span className="text-xs text-gray-500">Chat with us</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${shopDetails.email}`}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-5 text-center hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>

                  <span className="font-medium text-gray-900">Email Us</span>

                  <span className="text-xs text-gray-500 break-all">
                    {shopDetails.email}
                  </span>
                </a>
              </div>

              {/* Direct contact information */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Contact Information
                </h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-pink-600" />
                    <span>{shopDetails.phone1}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-pink-600" />
                    <span>{shopDetails.phone2}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-pink-600" />
                    <span>{shopDetails.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="h-64 flex flex-col items-center justify-center text-center px-6">
                <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-pink-600" />
                </div>

                <h3 className="font-semibold text-gray-900 mt-4">
                  {shopDetails.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Find us on Google Maps
                </p>

                <a
                  href={shopDetails.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-pink-700 transition"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
