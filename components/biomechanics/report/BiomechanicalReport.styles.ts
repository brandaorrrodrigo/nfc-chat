import styled from 'styled-components';

export const Container = styled.div`
  background: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
  max-width: 480px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border-radius: 8px;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;
`;

export const Subtitle = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  background: rgba(212, 175, 55, 0.2);
  color: #D4AF37;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin-top: 0.5rem;
`;

export const ThumbnailSection = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

export const ThumbnailCircle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 4px solid #D4AF37;
  margin: 0 auto 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 212, 200, 0.2), rgba(139, 92, 246, 0.2));
`;

export const ExerciseName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const MainScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
`;

export const ScoreCircle = styled.div<{ borderColor: string }>`
  width: 150px;
  height: 150px;
  border: 4px solid ${props => props.borderColor};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  position: relative;
`;

export const ScoreValue = styled.span`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
`;

export const ScoreMax = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const Classification = styled.span<{ color: string }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.color};
  letter-spacing: 0.1em;
`;

export const DetailedScoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
`;

export const ScoreCardContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ScoreCardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #10B981;
`;

export const ScoreCardLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const CaptureInfoContainer = styled.div`
  margin: 1.5rem 0;
`;

export const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #3B82F6;
  padding: 1rem;
  border-radius: 4px;
`;

export const InfoTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

export const InfoText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0;
`;

export const UpgradePrompt = styled.div`
  background: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 0.75rem;
`;

export const UpgradeIcon = styled.span`
  font-size: 1.25rem;
  margin-right: 0.5rem;
`;

export const UpgradeText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3B82F6;
`;

export const UpgradeReason = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.25rem;
`;

export const ROMContainer = styled.div`
  margin: 1.5rem 0;
`;

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1rem 0;
  color: #D4AF37;
`;

export const ROMItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

export const CheckIcon = styled.span`
  color: #10B981;
  margin-right: 0.5rem;
  font-size: 1rem;
`;

export const ROMText = styled.span`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`;

export const ROMTotal = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
`;

export const StabilityContainer = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid #10B981;
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
`;

export const BadgeIcon = styled.span`
  font-size: 1.25rem;
  margin-right: 0.5rem;
`;

export const BadgeTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: inline;
`;

export const BadgeText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.25rem 0;
`;

export const CompensationContainer = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border-left: 3px solid #F59E0B;
  padding: 1rem;
  border-radius: 4px;
  margin: 1.5rem 0;
`;

export const AlertIcon = styled.span`
  font-size: 1.25rem;
  margin-right: 0.5rem;
`;

export const AlertTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  display: inline;
  color: #F59E0B;
`;

export const AlertText = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
`;

export const MotivationalMessage = styled.div`
  text-align: center;
  padding: 1.5rem;
  margin: 2rem 0;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;

  p {
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const FooterLink = styled.p`
  font-size: 0.875rem;
  margin: 0;
  color: #3B82F6;
`;

export const FooterSubtext = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0.25rem 0 0 0;
`;

export const ExportButton = styled.button`
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563EB;
  }
`;
