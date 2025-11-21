import TermsHeader from "./TermsHeader";
import TermsContent from "./TermsContent";

export default function () {
	return (
		<div className="py-20 bg-[#EFEFEF] min-h-screen">
			<div className="max-w-4xl px-6 mx-auto">
				<TermsHeader />
				<TermsContent />
			</div>
		</div>
	);
}
