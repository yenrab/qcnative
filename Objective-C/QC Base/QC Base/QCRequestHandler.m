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
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 */

#import "QCRequestHandler.h"
#import "QCMapper.h"
#import "QCControlObject.h"
#import "StackWaitMonitor.h"
#import <CoreData/CoreData.h>


/*
 *	Private methods
 */
@interface QCRequestHandler (Private)

//this is the active method for which the public mapCommandTo*** methods are a facade.
- (void) mapCommandToCO:(NSString*)aCommand withFunction:(NSString*)aClassName toMap:(NSMutableDictionary*)aMap;

//this is the active method for which the public dispatchTo***CO methods are a facade
- (BOOL) dispatchToCO: (NSString*)command withParameters: (NSArray*)parameters andMap:(NSDictionary*)aMap;
- (BOOL) dispatchToCO: (NSDictionary*)aDictionary startingAt:(int)startingIndex;
- (BOOL) executeECOs: (NSArray*)allParams;
- (BOOL) executeCOsInDictionary:(NSDictionary*) theDictionary;

@end


@implementation QCRequestHandler

@synthesize command;
@synthesize parameters;
@synthesize mapper;
@synthesize theMonitor;
@synthesize coordinator;

@synthesize queue;

- (id) initWithCommand:(NSString*)aCommand andParameters:(NSMutableDictionary*)theParameters usingController:(QCMapper*)theAppController andCoordinator:(NSPersistentStoreCoordinator*)aCoordinator{
	if (!(self = [super init])) return nil;
	
	self.command = aCommand;
	self.parameters = theParameters;
	self.mapper = theAppController;
    self.coordinator = aCoordinator;
	
	NSCondition *theCondition = [[NSCondition alloc] init];
	self.theMonitor = [[StackWaitMonitor alloc]initWithCondition:theCondition];
	return self;
}

- (void)run{
	NSOperationQueue *theQueue = [[NSOperationQueue alloc] init];
	self.queue = theQueue;
	[theQueue addOperation:self];
}


- (void)main {
	[[NSRunLoop currentRunLoop] run];
	if([self dispatchToValCO]){
		if([self dispatchToBCO]){
			[self dispatchToVCO];
		}
	}
}


/*
 *	Below are the facade methods used to pass the command to the various 
 *	command objects of each type
 */

- (BOOL) dispatchToValCO{
	//NSLog(@"\n\n******************doing validation********************\n\n\n");
	return [self executeCOsInDictionary:self.mapper.validationMap];
}
- (BOOL) dispatchToBCO{
	//NSLog(@"\n\n******************doing business********************\n\n\n");
	return [self executeCOsInDictionary: self.mapper.businessMap];
}
- (BOOL) dispatchToVCO{
	//NSLog(@"\n\n******************doing view********************\n\n\n");
	[self performSelectorOnMainThread:@selector(executeVCOs:)
						   withObject:self.parameters
						waitUntilDone:NO];
	return YES;
}
- (BOOL) dispatchToECO: (NSString*)errorCommand withParameters: (NSMutableDictionary*)errorParameters{
    self.command = errorCommand;
	//NSLog(@"\n\n******************doing error********************\n\n\n");
	NSArray *allParams = @[errorCommand,errorParameters];
	[self performSelectorOnMainThread:@selector(executeECOs:)
						   withObject:allParams
						waitUntilDone:NO];
	return YES;
}

- (BOOL) dispatchToCO:(NSDictionary*)aDictionary{
	return [self dispatchToCO:aDictionary startingAt:0];
}

/*
 *  This is the worker method behind the facades that does the actual dispatching
 */
- (BOOL) dispatchToCO:(NSDictionary*)aDictionary startingAt:(int)startingIndex{
	//NSLog(@"dispatching for: %@",self.command);
    //set the default return to be YES so that if no command objects have been mapped processing still continues.
	BOOL retVal = YES;
    NSArray *theControlObjects = [aDictionary objectForKey:self.command];
    //NSLog(@"control objects: %@",theControlObjects);
	if(theControlObjects != nil){
        if ([self.parameters objectForKey:@"qcrequest handler"] == nil) {
            [self.parameters setObject:self forKey:@"qcrequest handler"];
        }
		int numControlObjects = [theControlObjects count];
		for(int i = startingIndex; i < numControlObjects; i++){
			QCControlObject *theControlClass = [theControlObjects objectAtIndex:i];
            //NSLog(@"Control Object: %@",theControlClass);
			QCReturnValue result = [[theControlClass class] handleIt:self.parameters];
            //NSLog(@"result of CO call: %@",result);
			if(result == QC_STACK_EXIT){
				retVal = NO;
				break;
			}
            else if(result == QC_STACK_WAIT){
                [self.theMonitor makeStackWait];
            }
		} 
	}
	return retVal;
}

- (BOOL) executeVCOs:(NSString*)aCommand{
	return [self executeCOsInDictionary:self.mapper.viewMap];
}


- (BOOL) executeECOs:(NSArray*)allParams{
    //self.command = [allParams objectAtIndex:0];
    self.parameters = [allParams objectAtIndex:1];
	return [self executeCOsInDictionary:self.mapper.errorMap];
}

- (BOOL) executeCOsInDictionary:(NSDictionary*) theDictionary{
	return [self dispatchToCO:theDictionary];
}




@end
