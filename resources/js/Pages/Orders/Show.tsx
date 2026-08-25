import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order } from '@/types';

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    const processOrder = () => router.post(route('orders.process', order.id), null, { preserveScroll: true });
    const completeOrder = () => router.post(route('orders.complete', order.id), null, { preserveScroll: true });
    const cancelOrder = () => { if (!confirm('Batalkan order ini?')) return; router.post(route('orders.cancel', order.id), null, { preserveScroll: true }); };

    return (
        <>
            <Head title={`Detail Order #${order.id}`} />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Detail Order #{order.id}</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">Meja</p>
                                    <p className="text-lg font-bold text-gray-900">{order.table?.name ?? '-'}</p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                        order.status === 'processed' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>{order.status?.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h4 className="font-semibold text-gray-700 mb-3">Item Pesanan</h4>
                                {order.items?.length ? (
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between py-2 border-b border-gray-50">
                                                <div><span className="font-medium">{item.product?.name}</span> <span className="text-gray-500 ml-2">x{item.quantity}</span></div>
                                                <span className="font-semibold">Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : <div className="text-gray-500 text-center py-4">Tidak ada item</div>}
                                <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                                    <span>Jumlah</span>
                                    <span className="text-blue-600">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                                </div>
                                <p className="mt-2 text-xs text-gray-400">Dibuat: {new Date(order.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="p-6 bg-gray-50 flex justify-end gap-3">
                                <Link href={route('orders.index')} className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Kembali</Link>
                                {order.status === 'pending' && <button onClick={processOrder} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Proses Order</button>}
                                {order.status === 'processed' && <button onClick={completeOrder} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Selesaikan</button>}
                                {['pending', 'processed'].includes(order.status) && <button onClick={cancelOrder} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">Batalkan</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
