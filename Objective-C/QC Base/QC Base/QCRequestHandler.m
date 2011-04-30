//
//  RequestOperation.m
//  iPhoneDevConQueryExample
//
//  Created by Lee Barney on 10/4/10.
//  Copyright 2010 __MyCompanyName__. All rights reserved.
//

#import "QCRequestHandler.h"
#import "QCMapper.h"
#import "QCControlObject.h"
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
@synthesize condition;
@synthesize coordinator;

@synthesize queue;

- (id) initWithCommand:(NSString*)aCommand andParameters:(NSMutableDictionary*)theParameters usingController:(QCMapper*)theAppController andCoordinator:(NSPersistentStoreCoordinator*)aCoordinator{
	[super init];
	
	self.command = aCommand;
	self.parameters = theParameters;
	self.mapper = theAppController;
    self.coordinator = aCoordinator;
	
	NSCondition *theCondition = [[NSCondition alloc] init];
	self.condition = theCondition;
	[theCondition release];
	
	
	NSOperationQueue *theQueue = [[NSOperationQueue alloc] init];
	self.queue = theQueue;
	[theQueue addOperation:self];
	return self;
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
	NSArray *allParams = [NSArray arrayWithObjects:errorCommand,errorParameters,nil];
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
	if(theControlObjects != nil){
        if ([self.parameters objectForKey:@"qcrequest handler"] == nil) {
            [self.parameters setObject:self forKey:@"qcrequest handler"];
        }
		int numCommandObjects = [theControlObjects count];
		for(int i = startingIndex; i < numCommandObjects; i++){
			QCControlObject *theControlClass = [theControlObjects objectAtIndex:i];
			id result = [[theControlClass class] doCommand:self.parameters];
			if(result == nil ||
					([result isKindOfClass:[NSString class]] && [((NSString*)result) isEqual:@"NO"])){
				retVal = NO;
				break;
			}
			else if ([result isKindOfClass:[NSString class]] && [((NSString*)result) isEqual:@"wait"]) {
				[self.condition lock];
				[self.condition wait];
				[self.condition unlock];
			}
			if(aDictionary == self.mapper.businessMap){
                NSMutableDictionary *parameterDictionary = (NSMutableDictionary*) self.parameters;
                NSMutableArray *results = [parameterDictionary objectForKey:@"BCOresults"];
                if (results == nil) {
                    results = [[NSMutableArray alloc] initWithCapacity:1];
                    [parameterDictionary setObject:results forKey:@"BCOresults"];
                    [results release];
                }
                [results addObject:result];
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



- (void)dealloc {
	self.condition = nil;
	[super dealloc];
}

@end
