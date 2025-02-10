import { Link } from '@inertiajs/react';

export default function MoneyFlowList({ items, type }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'partial': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link href={route('money-flows.show', item.id)} className="block hover:bg-gray-50">
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium text-blue-600 truncate">
                                        {item.person_name}
                                    </div>
                                    <div className="ml-2 flex-shrink-0">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 flex justify-between">
                                    <div>
                                        <div className="text-sm text-gray-900">
                                            Total: ৳{item.amount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Remaining: ৳{item.remaining_amount.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Due: {item.due_date}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
