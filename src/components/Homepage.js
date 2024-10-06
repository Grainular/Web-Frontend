import Map from "./Map";
import "../css/HomepageStyles.css";

export default function Homepage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section bg-main-green text-white text-center py-16">
                <h1 className="text-4xl font-bold mb-4 text-homepage-brown">
                    Stay Notified When LANDSAT Passes Overhead
                </h1>
                <p className="text-lg text-menu-green">
                    Receive alerts and access satellite imagery when LANDSAT satellites pass over your chosen location.
                </p>
            </section>

            {/* How to Use Section */}
            <section className="how-to-use bg-white text-main-green py-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
                    <p className="mb-6">
                        Drop a pin on the location where you'd like to track LANDSAT passes or enter your coordinates directly. Set your notification preferences to stay informed on the next satellite pass.
                    </p>
                </div>
            </section>

            {/* Map Component */}
            <Map />

            {/* Metadata Section */}
            <section className="metadata-section bg-light-brown p-6 mt-8 text-main-green">
                <h3 className="text-xl font-semibold mb-4 text-logo-brown">Metadata</h3>
                <ul className="list-disc pl-5">
                    <li><strong>Acquisition Satellite:</strong> LANDSAT 8</li>
                    <li><strong>Date:</strong> Oct 5, 2024</li>
                    <li><strong>Time:</strong> 10:32 AM UTC</li>
                    <li><strong>Latitude/Longitude:</strong> 44.032052, -65.488756</li>
                    <li><strong>WRS Path/Row:</strong> 010/033</li>
                    <li><strong>Percent Cloud Cover:</strong> 20%</li>
                    <li><strong>Image Quality:</strong> Good</li>
                </ul>
            </section>

            {/* Chart Section */}
            <section className="chart-section bg-white p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-logo-brown">Chart</h3>
                {/* Chart rendering goes here */}
            </section>
        </div>
    );
}
