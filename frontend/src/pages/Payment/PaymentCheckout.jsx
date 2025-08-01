import {motion} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../stores/useCartStore.js";
import {useCartTransformation} from "../../hooks/useCartTransformation.js";
import {useCheckoutFlow} from "../../hooks/useCheckoutFlow.js";
import {CheckoutHeader} from "../../components/checkout/CheckoutHeader.jsx";
import {EmptyCheckoutState} from "../../components/checkout/EmptyCheckoutState.jsx";
import {CheckoutProgress} from "../../components/checkout/CheckoutProgress.jsx";
import {OrderReview} from "../../components/checkout/OrderReview.jsx";
import {OrderSummary} from "../../components/checkout/OrderSummary.jsx";
import {PaymentFlow} from "../../components/checkout/PaymentFlow.jsx";


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, total } = useCartStore();

  // Custom hooks handle business logic
  const {
    currentStep,
    paymentData,
    user,
    creatingSession,
    processingPayment,
    error,
    paymentResult,
    updatePaymentData,
    startPaymentSession,
    submitPayment,
    retryPayment,
    startNewOrder,
  } = useCheckoutFlow();

  // Transform cart data for display
  const transformedCart = useCartTransformation(cart);

  // Guard clause - allow checkout flow to continue if payment result exists
  const shouldShowEmptyState = !user || (cart.length === 0 && !paymentResult);
  if (shouldShowEmptyState) {
    return <EmptyCheckoutState user={user} navigate={navigate} />;
  }

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen py-8"
      >
        <div className="max-w-7xl mx-auto px-4">
          <CheckoutHeader />
          <CheckoutProgress currentStep={currentStep} />

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <OrderReview transformedCart={transformedCart} />

            <div className="space-y-6">
              <OrderSummary
                  transformedCart={transformedCart}
                  total={total}
              />

              <PaymentFlow
                  currentStep={currentStep}
                  paymentData={paymentData}
                  updatePaymentData={updatePaymentData}
                  startPaymentSession={startPaymentSession}
                  submitPayment={submitPayment}
                  retryPayment={retryPayment}
                  startNewOrder={startNewOrder}
                  creatingSession={creatingSession}
                  processingPayment={processingPayment}
                  error={error}
                  paymentResult={paymentResult}
                  total={total}
              />
            </div>
          </div>
        </div>
      </motion.div>
  );
};

export default CheckoutPage;