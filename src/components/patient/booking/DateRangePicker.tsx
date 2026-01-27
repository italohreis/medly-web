interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export function DateRangePicker({ startDate, endDate, onStartDateChange, onEndDateChange }: DateRangePickerProps) {
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-medical-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-medical-900">Período</h2>
                    <p className="text-sm text-medical-500">Escolha o intervalo de datas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-1.5">
                        Data Início
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(e) => onStartDateChange(e.target.value)}
                        className="w-full px-4 py-3 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-1.5">
                        Data Fim
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => onEndDateChange(e.target.value)}
                        className="w-full px-4 py-3 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
