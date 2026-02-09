export default function PublicationHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="mb-10 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 pb-6">
        {profile.publication_logo_url && (
          <img
            src={profile.publication_logo_url}
            alt="Publication logo"
            className="
              w-12 h-12
              rounded-lg
              object-cover
              opacity-95
            "
          />
        )}

        <h1 className="text-2xl font-semibold leading-tight">
          {profile.publication_name || profile.name}
        </h1>
      </div>

      {profile.publication_tagline && (
        <p className="mt-2 opacity-70 max-w-xl mx-auto sm:mx-0">
          {profile.publication_tagline}
        </p>
      )}
    </div>
  );
}
