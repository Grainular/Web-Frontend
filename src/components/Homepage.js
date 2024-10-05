import Map from "./Map"
import '../css/MapStyles.css'; // Custom styles

export default function Homepage() {
    return (
        <div>
            <section className="hero-section bg-blue-500 text-white text-center py-16">
                <h1 className="text-4xl font-bold mb-4">Track LANDSAT Imagery for Your Farm</h1>
                <p className="text-lg">Get notified when LANDSAT satellites pass over your area, and access detailed satellite imagery tailored for agriculture.</p>
            </section>

            <section className="how-to-use bg-white text-gray-700 py-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
                    <p className="mb-6">
                        To get started, drop a pin on the location where you'd like to receive satellite imagery or enter your desired coordinates. Customize your notification settings to stay updated on the next LANDSAT pass.
                    </p>
                </div>
            </section>

            <Map />
            
            <section className="metadata-section bg-gray-100 p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4">Metadata</h3>
                <ul>
                    <li><strong>Acquisition Satellite:</strong> LANDSAT 8</li>
                    <li><strong>Date:</strong> Oct 5, 2024</li>
                    <li><strong>Time:</strong> 10:32 AM UTC</li>
                    <li><strong>Latitude/Longitude:</strong> 44.032052, -65.488756</li>
                    <li><strong>WRS Path/Row:</strong> 010/033</li>
                    <li><strong>Percent Cloud Cover:</strong> 20%</li>
                    <li><strong>Image Quality:</strong> Good</li>
                </ul>
            </section>

            <section className="chart-section bg-white p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4">Chart</h3>
                {/* Chart rendering goes here */}
            </section>

        </div>
    );
}
