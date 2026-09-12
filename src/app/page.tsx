import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deliveryPhases, product, type DeliveryStatus } from "@/config/product";

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  done: "Shipped",
  in_progress: "In progress",
  planned: "Planned",
};

const STATUS_CLASS: Record<DeliveryStatus, string> = {
  done: "bg-primary text-primary-foreground",
  in_progress: "bg-accent text-accent-foreground border",
  planned: "bg-muted text-muted-foreground",
};

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {product.name}
        </h1>
        <p className="text-lg text-pretty text-muted-foreground">
          {product.tagline}
        </p>
        <p className="text-sm text-pretty text-muted-foreground">
          {product.description}
        </p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="delivery">
        <h2 id="delivery" className="text-sm font-medium tracking-wide">
          Delivery status
        </h2>
        <ul className="flex flex-col gap-3">
          {deliveryPhases.map((phase) => (
            <li key={phase.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <CardTitle className="text-base">{phase.name}</CardTitle>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[phase.status]}`}
                  >
                    {STATUS_LABEL[phase.status]}
                  </span>
                </CardHeader>
                <CardContent className="text-sm text-pretty text-muted-foreground">
                  {phase.summary}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
