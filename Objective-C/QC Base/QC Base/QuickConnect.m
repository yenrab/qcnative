/*
 Copyright (c) 2008, 2009, 2012 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 The end-user documentation included with the redistribution, if any, must 
 include the following acknowledgment: 
 "This product was created using the QuickConnect framework.  http://www.quickconnectfamily.org", 
 in the same place and form as other third-party acknowledgments.   Alternately, this acknowledgment 
 may appear in the software itself, in the same form and location as other 
 such third-party acknowledgments.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */

#import "QuickConnect.h"
#import "QCMapper.h"
#import "ControlObjectStack.h"
#import "CommandDescriptor.h"
#import <CoreData/NSPersistentStoreCoordinator.h>

@interface QuickConnect(hidden)
- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(NSOperation*)aCallback andTrackRequestCount:(int)theNumberOfRequests;

@end

@implementation QuickConnect

@synthesize theMapper;
@synthesize theCoordinator;
@synthesize theGroupMap;

- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters{
	[self handleRequest:aCmd withParameters:parameters runInBackground:YES withCallback:nil];
}
- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(NSOperation*) aCallback{
    NSArray *subCommands = [theGroupMap objectForKey:aCmd];
    if(subCommands){
        for(int i = 0; i < [subCommands count]; i++){
            NSString *aSubCommand = [subCommands objectAtIndex:i];
            [self handleRequest:aSubCommand withParameters:parameters runInBackground:backgroundFlag withCallback:aCallback];
        }
        return;
    }
    [self handleRequest:aCmd withParameters:parameters runInBackground:backgroundFlag withCallback:aCallback andTrackRequestCount:1];
}


- (void) handleArrayOfRequests: (NSArray*) commands withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(NSOperation*) aCallback{
    int numRequestsToTrack = [commands count];
    if(backgroundFlag){
        numRequestsToTrack = 1;
    }
    for (int i = 0; i <[commands count]; i++) {
        [self handleRequest:[commands objectAtIndex:i] withParameters:parameters runInBackground:backgroundFlag withCallback:aCallback];
    }
}

- (void) handleRequest: (NSString*) aCmd withParameters:(NSMutableDictionary*) parameters runInBackground:(BOOL)backgroundFlag withCallback:(NSOperation*)aCallback andTrackRequestCount:(int)theNumberOfRequests{
    if(backgroundFlag){
        ControlObjectStack *aStack = [[ControlObjectStack alloc] initWithCommand:aCmd andParameters:parameters usingController:self.theMapper andCoordinator:theCoordinator trackingRequestCount:theNumberOfRequests withCallback:aCallback];
        [aStack run];
    }
    else{
        [[[ControlObjectStack alloc] initWithCommand:aCmd andParameters:parameters usingController:self.theMapper andCoordinator:theCoordinator trackingRequestCount:theNumberOfRequests withCallback:aCallback] run];
    }
}

- (void) handleRequest: (CommandDescriptor*)aDescriptor{
    [self handleRequest:aDescriptor.command withParameters:aDescriptor.parameters runInBackground:aDescriptor.runInBackground withCallback:aDescriptor.callback];
}

- (void) handleBatchRequest: (NSArray*)theDescriptors{
    int numDescriptors = [theDescriptors count];
    for (int i = 0; i < numDescriptors; i++) {
        CommandDescriptor *aDescriptor = [theDescriptors objectAtIndex:i];
        [self handleRequest:aDescriptor.command withParameters:aDescriptor.parameters runInBackground:aDescriptor.runInBackground withCallback:aDescriptor.callback andTrackRequestCount:numDescriptors];
    }
}

- (void) mapCommandToBCO:(NSString*)aCommand withObject:(Class)aClass{
    [self mapCommandToDCO:aCommand withObject:aClass];
}
- (void) mapCommandToDCO:(NSString*)aCommand withObject:(Class)aClass{
    [theMapper mapCommandToDCO:aCommand withHandler:aClass];
}
- (void) mapCommandToVCO:(NSString*)aCommand withObject:(Class)aClass{
	[theMapper mapCommandToVCO:aCommand withHandler:aClass];
}
- (void) mapCommandToValCO:(NSString*)aCommand withObject:(Class)aClass{
	[theMapper mapCommandToValCO:aCommand withHandler:aClass];
}
- (void) mapCommandToECO:(NSString*)aCommand withObject:(Class)aClass{
	[theMapper mapCommandToECO:aCommand withHandler:aClass];
}
- (void) mapCommandToSCO:(NSString*)aCommand withObject:(Class)aClass{
	[theMapper mapCommandToSCO:aCommand withHandler:aClass];
}

- (QuickConnect*) init{
	theMapper = [[QCMapper alloc] init];
	return self;
}

- (QuickConnect*) initWithPersistentStoreCoodinator:(NSPersistentStoreCoordinator *)aCoordinator{
    self.theCoordinator = aCoordinator;
    return [self init];
}
@end
