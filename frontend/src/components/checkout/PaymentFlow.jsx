import {motion, AnimatePresence} from "framer-motion";
import ReviewStep from "../payment/ReviewStep.jsx";
import PaymentStep from "../payment/PaymentStep.jsx";
import ResultStep from "../payment/ResultStep.jsx";
import ProcessingStep from "../payment/ProcessingStep.jsx";



export const PaymentFlow = ({
                         currentStep,
                         paymentData,
                         updatePaymentData,
                         startPaymentSession,
                         submitPayment,
                         retryPayment,
                         startNewOrder,
                         creatingSession,
                         processingPayment,
                         error,
                         paymentResult,
                         total
                     }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
        <AnimatePresence mode="wait">
            {currentStep === "review" && (
                <ReviewStep
                    onContinue={startPaymentSession}
                    loading={creatingSession}
                />
            )}
            {currentStep === "payment" && (
                <PaymentStep
                    paymentData={paymentData}
                    onInputChange={updatePaymentData}
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitPayment(total);
                    }}
                    error={error}
                    loading={processingPayment}
                />
            )}
            {currentStep === "processing" && <ProcessingStep />}
            {currentStep === "result" && (
                <ResultStep
                    result={paymentResult}
                    onRetry={retryPayment}
                    onNewOrder={startNewOrder}
                />
            )}
        </AnimatePresence>
    </motion.div>
);