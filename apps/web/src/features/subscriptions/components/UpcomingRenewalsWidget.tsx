

export const UpcomingRenewalsWidget = () => {
  const isLoading = false;
  const data: any[] = [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Upcoming Renewals</h3>
      {data?.length === 0 ? (
        <p className="text-gray-500">No upcoming renewals.</p>
      ) : (
        <ul className="space-y-3">
          {data?.map((sub: any) => (
            <li key={sub.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-semibold">{sub.name}</p>
                <p className="text-xs text-gray-500">Renews: {new Date(sub.renewalDate).toLocaleDateString()}</p>
              </div>
              <p className="font-bold">{sub.currency} {sub.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
