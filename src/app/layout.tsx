import type { Metadata } from "next";
import "./globals.css";
import { TranscriptProvider } from "./contexts/TranscriptContext";
import { EventProvider } from "./contexts/EventContext";
import { ReplyProvider } from "./contexts/ReplyContext";
import { TicketDisplayProvider } from "./contexts/TicketDisplayContext";

export const metadata: Metadata = {
  title: "Squiddles - Voice AI Interface",
  description: "Extensible voice AI interface with specialized agent tentacles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <EventProvider>
          <TranscriptProvider>
            <ReplyProvider>
              <TicketDisplayProvider>
                {children}
              </TicketDisplayProvider>
            </ReplyProvider>
          </TranscriptProvider>
        </EventProvider>
      </body>
    </html>
  );
}