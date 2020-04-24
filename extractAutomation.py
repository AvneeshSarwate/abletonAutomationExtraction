import gzip
import sys 
import xml.etree.ElementTree as ET


als_xml = gzip.open('p5Control.als').read()
tree = ET.fromstring(als_xml)

def getClipsForTrack(trackNumber):
    trackNum = trackNumber #maybe make this track name instead?
    track = tree[0].find("Tracks").findall("MidiTrack")[trackNum]
    clipSlots = track.find("DeviceChain").find("MainSequencer").find("ClipSlotList").findall("ClipSlot")
    clipval = lambda cs: cs.find("ClipSlot").find("Value").find("MidiClip")
    clips = [clipval(cs) for cs in clipSlots if clipval(cs) is not None]
    return clips

def getAutomationsForClip(clip):
    clipEnvelopes = clip.find("Envelopes").find("Envelopes").findall("ClipEnvelope")
    
    return clipEnvelopes
    
clips = getClipsForTrack(0)
getAutomationsForClip(clips[0])


# FloatEvent tag holds automation events
# PointeeId in ClipEnvelope refers to device param being automated
# MxDFloatParameter->AutomationTarget[Id] is same id as PointeeId
# MxDFloatParameter->ShortName gives displayName of the parameter