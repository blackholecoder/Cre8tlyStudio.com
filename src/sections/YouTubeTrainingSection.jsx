export default function YouTubeTrainingSection() {
  return (
    <section className="w-full mt-16 px-4 sm:px-6 flex flex-col items-center text-center">
      <h3 className="text-2xl sm:text-3xl font-bold text-white design-text mb-3">
        More Training Videos
      </h3>

      <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
        Learn the full workflow from idea to finished digital product. Watch
        additional Cre8tly Studio tutorials below.
      </p>

      {/* Embedded YouTube Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {/* Video 1 */}
        <div className="flex flex-col items-start bg-transparent">
          <div className="rounded-xl overflow-hidden shadow-lg bg-black w-full">
            <iframe
              className="w-full h-56 sm:h-48"
              src="https://www.youtube.com/embed/3LvfMBTpp2A?si=x-zKddScen3iSbDs"
              title="Training Video 1"
              allowFullScreen
            />
          </div>

          <p className="mt-3 text-gray-300 text-sm sm:text-base font-medium">
            How to Create a Lead Magnet in Cre8tly Studio, Part 1: Pro Document
            Creation
          </p>
        </div>

        {/* Video 2 */}
        <div className="flex flex-col items-start bg-transparent">
          <div className="rounded-xl overflow-hidden shadow-lg bg-black w-full">
            <iframe
              className="w-full h-56 sm:h-48"
              src="https://www.youtube.com/embed/fHOFhDukfQ8?si=RJgEocSuv7nTd21G"
              title="Training Video 2"
              allowFullScreen
            />
          </div>

          <p className="mt-3 text-gray-300 text-sm sm:text-base font-medium">
            How to Create a Lead Magnet in Cre8tly Studio, Part 5: Landing Page
            Builder
          </p>
        </div>

        {/* Video 3 */}
        <div className="flex flex-col items-start bg-transparent">
          <div className="rounded-xl overflow-hidden shadow-lg bg-black w-full">
            <iframe
              className="w-full h-56 sm:h-48"
              src="https://www.youtube.com/embed/mFgSGnrU-pw?si=i0HWn8h6akYLDwx9"
              title="Training Video 3"
              allowFullScreen
            />
          </div>

          <p className="mt-3 text-gray-300 text-sm sm:text-base font-medium">
            How to Create a Lead Magnet in Cre8tly Studio, Part 6: Seller Dashboard and Landing Page Analytics
          </p>
        </div>
      </div>

      {/* CTA Link */}
      <a
        href="https://youtube.com/playlist?list=PLz_0C2KQJpQMvgegTRCKN3J_DqhBOBLbN&si=hboNr0H2rlhLdVxU"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:opacity-90 transition-all mt-20"
      >
        View Full Playlist on YouTube
      </a>
    </section>
  );
}
