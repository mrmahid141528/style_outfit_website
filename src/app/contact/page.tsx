import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="flex-1 min-h-screen flex flex-col pt-4 bg-white text-gray-900 font-sans">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-32">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-4 block">Get In Touch</span>
            <h1 
              className="text-5xl sm:text-6xl font-bold tracking-tight mb-6"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Contact Us
            </h1>
            <p className="text-gray-600 font-light text-lg">
              Have a question about a look, or want to collaborate? Drop us a message below.
            </p>
          </div>

          <form className="bg-gray-50 p-8 sm:p-12 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                  placeholder="john@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" 
                placeholder="How can we help?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white resize-none" 
                placeholder="Write your message here..."
              />
            </div>

            <button 
              type="button" 
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors shadow-md mt-4"
            >
              Send Message
            </button>
          </form>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
