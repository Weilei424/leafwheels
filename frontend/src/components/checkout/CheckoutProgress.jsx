export const CheckoutProgress = ({ currentStep }) => {
    const steps = ["review", "payment", "processing", "result"];
    const currentIndex = steps.indexOf(currentStep);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center">
                        <StepIndicator
                            stepNumber={index + 1}
                            isActive={currentIndex >= index}
                        />
                        {index < steps.length - 1 && (
                            <StepConnection isActive={currentIndex > index} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const StepIndicator = ({ stepNumber, isActive }) => (
    <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isActive ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
        }`}
    >
        {stepNumber}
    </div>
);

const StepConnection = ({ isActive }) => (
    <div
        className={`w-16 h-1 ${
            isActive ? "bg-green-600" : "bg-gray-200"
        }`}
    />
);